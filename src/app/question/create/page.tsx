import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Create() {
  const createQuestion = async (formData: FormData) => {
    "use server"
    const title = formData.get("title")
    const description = formData.get("description")
    console.log(title, description)
  }
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create question</CardTitle>
        </CardHeader>
        <form action={createQuestion}>
          <CardContent>
            <Input name="title" placeholder="Enter title..." />
            <Textarea name="description" rows={12} placeholder="Enter description..." className="mt-3" />

          </CardContent>
          <CardFooter>
            <Button>Submit</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
