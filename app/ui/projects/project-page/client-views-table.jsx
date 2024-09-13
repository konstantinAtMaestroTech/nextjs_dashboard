'use client';

import ViewRecord from '@/app/ui/projects/project-page/client-viewers-record'

export default function ViewsTable(views)
{        
    views = views.views // pls fix it for the love of god
    
    return (
        <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  View Title
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  View Subtitle
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Link
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {views?.map((view) => (
                <ViewRecord key={view.id} view ={view} />
              ))}
            </tbody>
        </table>
    )
}