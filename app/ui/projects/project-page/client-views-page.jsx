import {DeleteClientView, ShowSupersets} from '@/app/ui/projects/project-page/buttons';
import { fetchClientViewsByProjectId, fetchViewsByRoomId } from '@/app/lib/db/data';
import ViewsTable from '@/app/ui/projects/project-page/client-views-table'

export default async function ViewsPage({
  query,
  currentPage,
}){
  let views = await fetchClientViewsByProjectId(query, currentPage);

  async function getSupersets(views) {

    const promises = views.map(async (view)=> {
      view.supersets = await fetchViewsByRoomId(view.id);
      return view
    })

    const results = await Promise.all(promises);
    return results;
  }

  views = await getSupersets(views)

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {views?.map((view) => (
              <div
                key={view.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="mb-2 flex items-center">
                      <p>{view.title}</p>
                    </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <DeleteClientView id={view.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ViewsTable views={views} />
        </div>
      </div>
    </div>
  );
}
