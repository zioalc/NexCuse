/**
 * JSON fetch helper: parses body, surfaces API `error` strings, throws ApiError on failure.
 */
export class ApiError extends Error {
  constructor(message, status, body) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

/**
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<Record<string, unknown>|null>}
 */
export async function fetchJson(url, options = {}) {
  const opts = { ...options }
  if (opts.body != null && typeof opts.body === "string") {
    opts.headers = {
      "Content-Type": "application/json",
      ...opts.headers,
    }
  }

  const res = await fetch(url, opts)
  const text = await res.text()
  let data = {}
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = {}
    }
  }

  if (!res.ok) {
    const msg =
      typeof data.error === "string"
        ? data.error
        : `Request failed (${res.status})`
    throw new ApiError(msg, res.status, data)
  }

  return data
}
