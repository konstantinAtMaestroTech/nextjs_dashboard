import * as React from 'react';

interface EmailTemplateProps {
  receiverName: string;
  senderName: string;
  projectTitle: string;
  projectSubtitle: string;
  projectURL: string;
}

export function EmailTemplate ({
  receiverName,
  projectURL,
  senderName,
  projectTitle,
  projectSubtitle
}: EmailTemplateProps): JSX.Element {
  const brandColor = "#ff3c00"
  const color = {
    background: "#ffffff",
    text: "#444",
    mainBackground: "#c2c3c4",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#fff",
  }
  /* The nextjs native image component does not work here so we again have ot do the link facade */

  const imageUrl = "https://app.maestro-tech.com/_next/image?url=%2FLogo_Extended.png&w=640&q=75"

  // for emails the tables are used instead of divs because email clietns suck in CSS

  return (
    <body>
      <table width="100%" style={{ background: color.mainBackground, maxWidth: '600px', margin: 'auto', borderRadius: '10px' }}>
        <tr>
          <td style={{ padding: "40px 40px", textAlign: "center" }}>
            <img src={imageUrl} alt="Your Image" style={{ maxWidth: '100%', height: 'auto'}} />
          </td>
        </tr>
        <tr>
          <td style={{ background: "#d9d9d9", padding: "20px 10px", fontSize: "22px", fontFamily: "Helvetica, Arial, sans-serif", color: "#000000", textAlign: "center" }}>
            Hey <span style={{ fontWeight: 'bolder' }}>{receiverName}</span>!
            <br /><span style={{ fontWeight: 'bolder' }}>{senderName}</span> is trying to reach you at
            <br />
            <br /><span>{projectTitle}</span>
            <br />-
            <br /><span>{projectSubtitle}</span>
          </td>
        </tr>
        <tr>
          <td style={{ textAlign: "center" }}>
            <a href={projectURL} target="_blank" style={{ 
              fontSize: "18px", 
              fontFamily: "Helvetica, Arial, sans-serif", 
              color: color.buttonText, 
              textDecoration: "none", 
              borderRadius: "5px", 
              padding: "10px 20px", 
              border: `1px solid ${color.buttonBorder}`, 
              display: "inline-block", 
              fontWeight: "bold", 
              backgroundColor: color.buttonBackground, 
              width: "-webkit-fill-available" 
            }}>
              JOIN THE CONVERSATION
            </a>
          </td>
        </tr>
      </table>
    </body>
  )
  
};
