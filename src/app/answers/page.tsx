import { challengesWithFlags } from "@/lib/challenges-server";
import { AnswersAuth } from "@/components/ctf/AnswersAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnswersPage() {
  const answersTable = (
    <div className="container mx-auto py-10">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-headline font-bold">Challenge Answers</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Admin-only view of all flags.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challenge</TableHead>
                <TableHead>Flag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challengesWithFlags.map((challenge) => (
                <TableRow key={challenge.id}>
                  <TableCell className="font-medium">{challenge.title}</TableCell>
                  <TableCell className="font-code">{challenge.flag}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  return <AnswersAuth>{answersTable}</AnswersAuth>;
}
