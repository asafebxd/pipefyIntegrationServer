async function sendBody(webhook, body) {
  const res = await fetch(`https://n8n.choranmidias.com/webhook/${webhook}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      body: body,
    }),
  });

  console.log(`Status ${webhook}: ${res.status}`);

  console.log(await res.json());
}
export const n8n = {
  sendBody,
};
