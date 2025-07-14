import { AtmDataTable } from "@/components/admin/atm-data-table";
import { mockAtms } from "@/lib/mock-data";

export default function AdminPanelPage() {
    const atms = mockAtms;

    return (
        <div>
            <AtmDataTable data={atms} />
        </div>
    )
}
