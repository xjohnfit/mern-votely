import Thumbnail1 from "../assets/flag1.jpg";
import Thumbnail2 from "../assets/flag2.jpg";
import Thumbnail3 from "../assets/flag3.png";
import Candidate1 from "../assets/candidate1.jpg";
import Candidate2 from "../assets/candidate2.jpg";
import Candidate3 from "../assets/candidate3.jpg";
import Candidate4 from "../assets/candidate4.jpg";
import Candidate5 from "../assets/candidate5.jpg";
import Candidate6 from "../assets/candidate6.jpg";
import Candidate7 from "../assets/candidate7.jpg";

export const elections = [
    {
        id: 1,
        title: "Presidential Election",
        description: "Vote for the next president of the United States.",
        thumbnail: Thumbnail1,
        candidates: ["c1", "c2", "c3", "c4"],
        voters: [],
    },
    {
        id: 2,
        title: "Gubernatorial Election",
        description: "Vote for the next governor of California.",
        thumbnail: Thumbnail2,
        candidates: ["c5", "c6", "c7"],
        voters: [],
    },
    {
        id: 3,
        title: "Mayoral Election",
        description: "Vote for the next mayor of New York City.",
        thumbnail: Thumbnail3,
        candidates: ["c1", "c3", "c5"],
        voters: [],
    }
];

export const candidates = [
    {
        id: "c1",
        fullName: "John Doe",
        image: Candidate1,
        motto: "A better future for all.",
        voteCount: 23,
        electionId: 1,
    },
    {
        id: "c2",
        fullName: "Jane Smith",
        image: Candidate2,
        motto: "Together we can achieve more.",
        voteCount: 15,
        electionId: 1,
    },
    {
        id: "c3",
        fullName: "Michael Johnson",
        image: Candidate3,
        motto: "Innovation and progress.",
        voteCount: 30,
        electionId: 1,
    },
    {
        id: "c4",
        fullName: "Emily Davis",
        image: Candidate4,
        motto: "A voice for everyone.",
        voteCount: 12,
        electionId: 1,
    },
    {
        id: "c5",
        fullName: "William Brown",
        image: Candidate5,
        motto: "Leadership with integrity.",
        voteCount: 20,
        electionId: 2,
    },
    {
        id: "c6",
        fullName: "Olivia Wilson",
        image: Candidate6,
        motto: "Building a brighter future.",
        voteCount: 18,
        electionId: 2,
    },
    {
        id: "c7",
        fullName: "James Taylor",
        image: Candidate7,
        motto: "Experience you can trust.",
        voteCount: 25,
        electionId: 2,
    }
];

export const voters = [
    {
        id: "v1",
        fullName: "Alice Johnson",
        email: "alice.johnson@example.com",
        password: "password123",
        isAdmin: false,
        votedElections: [1, 2],
    },
    {
        id: "v2",
        fullName: "Bob Smith",
        email: "bob.smith@example.com",
        password: "password456",
        isAdmin: false,
        votedElections: [1],
    },
    {
        id: "v3",
        fullName: "Charlie Brown",
        email: "charlie.brown@example.com",
        password: "password789",
        isAdmin: false,
        votedElections: [2],
    },
    {
        id: "v4",
        fullName: "David Wilson",
        email: "david.wilson@example.com",
        password: "password012",
        isAdmin: false,
        votedElections: [1, 3],
    }
];
