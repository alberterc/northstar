export function jsonResponse(
  success,
  data = null,
  error = null,
  status = 200,
  headers = { "Content-Type": "application/json" },
) {
  return new Response(JSON.stringify({ success, data, error }), {
    status,
    headers,
  });
}
