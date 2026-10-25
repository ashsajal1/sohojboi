import { clerkClient, User } from "@clerk/nextjs/server"
import { columns } from "./columns"
import { DataTable } from "./data-table"


export default async function DemoPage() {
  const client = await clerkClient();
  let users: User[] = (await client.users.getUserList()).data;
  users = JSON.parse(JSON.stringify(users))
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={users} />
    </div>
  )
}
