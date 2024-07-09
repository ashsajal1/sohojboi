import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import CreateForm from "./create-form";

export default async function Create() {

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create question</CardTitle>
        </CardHeader>
        <CreateForm />
      </Card>
    </div>
  )
}
