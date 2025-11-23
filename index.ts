import decapCMSLoginScript from './decap-cms-login-script';

addEventListener('fetch', (event: any) => {
  event.respondWith(handle(event.request));
});

// Inserted as secrets to the worker
// @ts-ignore
const client_id = CLIENT_ID;
// @ts-ignore
const client_secret = CLIENT_SECRET;

async function handle(request: Request) {
  const { pathname, searchParams: params } = new URL(request.url);

  switch (pathname) {
    case '/auth':
      return redirectToAuthFlow();

    case '/callback':
      return await fetchAccessToken(params);
  }

  return new Response();
}

async function fetchAccessToken(requestParams: URLSearchParams) {
  try {
    const code = requestParams.get('code');

    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'user-agent': 'decap-cms-github-oauth-api-cloudflare',
          accept: 'application/json',
        },
        body: JSON.stringify({ client_id, client_secret, code }),
      }
    ).then((res) => res.json());

    const loginResponse = decapCMSLoginScript(response.access_token);

    return new Response(loginResponse, {
      status: 201,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(err.message, {
      status: 500,
    });
  }
}

function redirectToAuthFlow() {
  return Response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user`,
    302
  );
}
