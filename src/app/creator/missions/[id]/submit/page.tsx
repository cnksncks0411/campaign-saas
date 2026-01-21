import MissionSubmitClient from "@/components/missions/mission-submit-client"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function MissionSubmitPage({ params }: PageProps) {
    const { id } = await params

    return <MissionSubmitClient participantId={id} />
}
