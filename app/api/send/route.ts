import { EmailTemplateClientView, EmailTemplateProject } from '@/app/ui/email-templates/user-mention';
import { Resend } from 'resend';
import {headers} from 'next/headers';

const resend = new Resend(process.env.EMAIL_SERVER_PASSWORD);

export async function POST(req: Request) {

    const data = await req.json();
    const headersList = headers();
    const sender = headersList.get('x-maestro-sender');

    const {senderName, receiverEmail, receiverName, projectURL} = data;

    switch (sender) {
      case "cview":
        const {projectTitle, projectSubtitle} = data
        try {
            const { data, error } = await resend.emails.send({
              from: `Maestro Mate <${process.env.EMAIL_FROM}>`,
              to: [receiverEmail],
              subject: `You have a new message waiting at ${projectTitle}|${projectSubtitle}!`,
              react: EmailTemplateClientView({ receiverName: receiverName, senderName: senderName, projectTitle: projectTitle, projectSubtitle: projectSubtitle, projectURL: projectURL }),
            });
        
            if (error) {
                console.log('That is the error that has occured', error);
                return Response.json({ error }, { status: 500 });
            }
        
            return Response.json(data);
          } catch (error) {
            return Response.json({ error }, { status: 500 });
        }
        break;
      case "project":
        const {project} = data
        try {
          const { data, error } = await resend.emails.send({
            from: `Maestro Mate <${process.env.EMAIL_FROM}>`,
            to: [receiverEmail],
            subject: `You have a new message waiting at ${project}!`,
            react: EmailTemplateProject({ receiverName: receiverName, senderName: senderName, project: project, projectURL: projectURL }),
          });
      
          if (error) {
              console.log('That is the error that has occured', error);
              return Response.json({ error }, { status: 500 });
          }
      
          return Response.json(data);
        } catch (error) {
          return Response.json({ error }, { status: 500 });
      }
      break;
    }
    

}