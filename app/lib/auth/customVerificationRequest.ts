import { fetchUrnByClientViewId } from "@/app/lib/db/data"

export async function customVerificationRequest(params: any) {

    function extractViewId(url: string): string | null {
        const regex = /client\/([a-f0-9-]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    const { identifier: to, provider, url, theme } = params

    const viewId = extractViewId(decodeURIComponent(url))

    const {title, subtitle} = await fetchUrnByClientViewId(viewId);
    console.log('result of the query', title);


    const { host } = new URL(url);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${provider.server.auth.pass}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: provider.from,
        to,
        subject: `Sign in to ${host}`,
        html: html({ url, host, theme, title, subtitle, viewId}),
        text: text({ url, host }),
      }),
    })
   
    if (!res.ok)
      throw new Error("Resend error: " + JSON.stringify(await res.json()))
  }
   
function html(params: { url: string; host: string; theme: Theme, title: any, subtitle: any, viewId: string}) {

  const { url, host, theme, title, subtitle, viewId} = params
  
  const escapedHost = host.replace(/\./g, "&#8203;.");
  console.log('host', host);
  console.log('escaped host', escapedHost);
  
  const brandColor = "#ff3c00";
  const color = {
    background: "#ffffff",
    text: "#444",
    mainBackground: "#c2c3c4",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  };

  const imageUrl = "https://app.maestro-tech.com/_next/image?url=%2FLogo_Extended.png&w=640&q=75" // i am not sure that this is the right way to do it
  
  return `
<body>
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <img src="${imageUrl}" alt="Your Image" style="max-width: 100%; height: auto; border-radius: 10px;">
      </td>
    </tr>
    <tr>
      <td align="center"
        style="background: #d9d9d9; padding: 10px 10px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #000000; border-radius: 7px;">
        You were invited <br/><strong>${title}</strong><br/><span style="font-weight: 600;">${subtitle}</span> 
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">
                ACCEPT THE INVITATION</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #000000;">
        <strong>OR USE <a href="https://${escapedHost}/client/${viewId}" target="_blank" style="color: ${brandColor};">THIS</a> LINK IF YOU HAVE ALREADY LOGGED IN</strong>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        This email and any attachments are intended solely for the use of the individual or entity to which they are addressed. If you have received this email in error, please notify the sender immediately, and delete it from your system. Any unauthorized review, use, disclosure, or distribution is prohibited.
      </td>
    </tr>
  </table>
</body>
`
}
  
// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}
