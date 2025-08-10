export async function safeJson(response, fallback = {}) {
  try {
    if (!response) return fallback
    const get = response.headers?.get?.bind(response.headers)
    const contentType = get ? get('content-type') || '' : ''
    if (contentType.includes('application/json')) {
      return await response.json()
    }
    const text = await response.text()
    return text ? JSON.parse(text) : fallback
  } catch {
    return fallback
  }
}

export async function safeFetchJson(input, init, fallback = {}) {
  const res = await fetch(input, init)
  return await safeJson(res, fallback)
}
