import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleChat } from './api/chat.js'

function localChatApi(env) {
  return {
    name: 'local-chat-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res, next) => {
        let body = {}
        if (req.method === 'POST') {
          const chunks = []
          let size = 0
          try {
            for await (const chunk of req) {
              size += chunk.length
              if (size > 256 * 1024) {
                res.statusCode = 413
                res.end(JSON.stringify({ error: 'Request body is too large.' }))
                return
              }
              chunks.push(chunk)
            }
            const rawBody = Buffer.concat(chunks).toString('utf8')
            body = rawBody ? JSON.parse(rawBody) : {}
          } catch {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Request body must be valid JSON.' }))
            return
          }
        }

        const apiResponse = {
          status(code) {
            res.statusCode = code
            return this
          },
          setHeader(name, value) {
            res.setHeader(name, value)
          },
          json(value) {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(value))
          },
        }

        try {
          await handleChat({ method: req.method, headers: req.headers, body }, apiResponse, env)
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), '')
  const env = {
    ...loadedEnv,
    BASE_API_URL: process.env.BASE_API_URL || loadedEnv.BASE_API_URL,
    GROQ_API_KEY: process.env.GROQ_API_KEY || loadedEnv.GROQ_API_KEY,
    GROQ_MODEL: process.env.GROQ_MODEL || loadedEnv.GROQ_MODEL,
  }

  return {
    plugins: [react(), tailwindcss(), localChatApi(env)],
    envPrefix: ['VITE_', 'BASE_'],
  }
})