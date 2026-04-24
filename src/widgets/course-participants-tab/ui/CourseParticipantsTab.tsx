import { useState } from "react";

import { ParticipantsList } from "@/entities/user";

import { ParticipantSearch } from "@/features/participant/search";

import { mockParticipants } from "../model/mockParticipants";

export function CourseParticipantsTab() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParticipants = mockParticipants.filter((participant) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const fullName = `${participant.firstName} ${participant.lastName}`.toLowerCase();
    return fullName.includes(query);
  });

  return (
    <div className="space-y-3">
      <ParticipantSearch value={searchQuery} onChange={setSearchQuery} />
      <ParticipantsList participants={filteredParticipants} />
    </div>
  );
}
