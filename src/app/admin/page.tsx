import { AdminDashboard } from "@/components/ctf/AdminDashboard";

export default function AdminPage() {
  return (
    <div>
        <header className="text-center mb-8">
            <h1 className="text-4xl font-headline font-bold">Admin Panel</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                View game data and utilities.
            </p>
        </header>
        <AdminDashboard />
    </div>
  )
}
