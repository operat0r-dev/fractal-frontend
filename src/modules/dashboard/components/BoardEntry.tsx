import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BoardEntry(props: { title: string }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Task name</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">{props.title}</div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
