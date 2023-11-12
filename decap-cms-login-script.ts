// Original version – https://github.com/vencax/netlify-cms-github-oauth-provider/blob/master/login_script.js
export default function (token: string) {
  return `<script>
(function() {
  function receiveMessage(e) {
    console.log("receiveMessage %o", e)

    // send message to the main window
    window.opener.postMessage(
      'authorization:github:success:${JSON.stringify({
        provider: 'github',
        token,
      })}',
      e.origin
    )
  }
  window.addEventListener("message", receiveMessage, false)
  // Start handshake with parent
  console.log("Sending message: %o", "github")
  window.opener.postMessage("authorizing:github", "*")
})()
</script>`;
}
