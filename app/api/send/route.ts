import { EmailTemplate } from '@/app/ui/chat/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.EMAIL_SERVER_PASSWORD);

export async function POST(req: Request) {

    const data = await req.json();
    const {senderName, receiverEmail, receiverName, projectTitle, projectSubtitle, projectURL} = data
    console.log(senderName, receiverEmail, receiverName, projectTitle, projectSubtitle, projectURL)
    try {
        const { data, error } = await resend.emails.send({
          from: 'no-reply@maestrotest.info',
          to: [receiverEmail],
          subject: `You have a new message waiting at ${projectTitle}|${projectSubtitle}!`,
          react: EmailTemplate({ receiverName: receiverName, senderName: senderName, projectTitle: projectTitle, projectSubtitle: projectSubtitle, projectURL: projectURL }),
        });
    
        if (error) {
            console.log('That is the error that has occured', error);
            return Response.json({ error }, { status: 500 });
        }
    
        return Response.json(data);
      } catch (error) {
        return Response.json({ error }, { status: 500 });
    }

}