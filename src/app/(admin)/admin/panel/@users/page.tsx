import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      "id": "728ed52f",
      "amount": 100,
      "status": "pending",
      "email": "m@example.com"
  },
  {
      "id": "9b76a8c1",
      "amount": 150,
      "status": "completed",
      "email": "a@example.com"
  },
  {
      "id": "2c34e78d",
      "amount": 200,
      "status": "failed",
      "email": "b@example.com"
  },
  {
      "id": "7d89c3b2",
      "amount": 250,
      "status": "pending",
      "email": "c@example.com"
  },
  {
      "id": "3f67b1a9",
      "amount": 300,
      "status": "completed",
      "email": "d@example.com"
  },
  {
      "id": "6a45e2b8",
      "amount": 350,
      "status": "failed",
      "email": "e@example.com"
  },
  {
      "id": "5b32d4c7",
      "amount": 400,
      "status": "pending",
      "email": "f@example.com"
  },
  {
      "id": "1d23f6e8",
      "amount": 450,
      "status": "completed",
      "email": "g@example.com"
  },
  {
      "id": "8c79a5d6",
      "amount": 500,
      "status": "failed",
      "email": "h@example.com"
  },
  {
      "id": "4e56b7f1",
      "amount": 550,
      "status": "pending",
      "email": "i@example.com"
  },
  {
      "id": "7f38c2d9",
      "amount": 600,
      "status": "completed",
      "email": "j@example.com"
  },
  {
      "id": "9d48e3b2",
      "amount": 650,
      "status": "failed",
      "email": "k@example.com"
  },
  {
      "id": "2a59f4c3",
      "amount": 700,
      "status": "pending",
      "email": "l@example.com"
  },
  {
      "id": "5b67a8d4",
      "amount": 750,
      "status": "completed",
      "email": "m@example.com"
  },
  {
      "id": "8e79b9e5",
      "amount": 800,
      "status": "failed",
      "email": "n@example.com"
  }
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
