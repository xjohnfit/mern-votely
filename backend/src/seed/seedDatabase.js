import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { connectDB } from '../lib/db.js';
import VoterModel from '../models/voterModel.js';
import ElectionModel from '../models/electionModel.js';
import CandidateModel from '../models/candidatesModel.js';

// All seeded voters share this password so you can log in as any of them.
const SEED_PASSWORD = 'Password123!';

const voterData = [
    { fullName: 'Admin User', email: 'admin@example.com', isAdmin: true },
    { fullName: 'Alice Johnson', email: 'alice@example.com' },
    { fullName: 'Bob Smith', email: 'bob@example.com' },
    { fullName: 'Carla Mendes', email: 'carla@example.com' },
    { fullName: 'David Lee', email: 'david@example.com' },
    { fullName: 'Emma Wilson', email: 'emma@example.com' },
];

const electionData = [
    {
        title: 'Student Council President 2026',
        description: 'Annual election to choose the next student council president.',
        thumbnail: 'https://picsum.photos/seed/election-council/600/400',
        candidates: [
            { fullName: 'Maria Gonzalez', motto: 'Every voice counts.', image: 'https://picsum.photos/seed/maria/400/400' },
            { fullName: 'James Carter', motto: 'Building a better campus together.', image: 'https://picsum.photos/seed/james/400/400' },
            { fullName: 'Priya Patel', motto: 'Progress through participation.', image: 'https://picsum.photos/seed/priya/400/400' },
        ],
    },
    {
        title: 'Neighborhood Association Chair',
        description: 'Election for the chairperson of the neighborhood association board.',
        thumbnail: 'https://picsum.photos/seed/election-neighborhood/600/400',
        candidates: [
            { fullName: 'Tom Nguyen', motto: 'Safer streets, stronger community.', image: 'https://picsum.photos/seed/tom/400/400' },
            { fullName: 'Linda Okafor', motto: 'Your neighborhood, your say.', image: 'https://picsum.photos/seed/linda/400/400' },
        ],
    },
    {
        title: 'Tech Club Lead Developer',
        description: 'Vote for the next lead developer of the university tech club.',
        thumbnail: 'https://picsum.photos/seed/election-tech/600/400',
        candidates: [
            { fullName: 'Sofia Rossi', motto: 'Ship it with quality.', image: 'https://picsum.photos/seed/sofia/400/400' },
            { fullName: 'Kenji Tanaka', motto: 'Code for everyone.', image: 'https://picsum.photos/seed/kenji/400/400' },
            { fullName: 'Omar Haddad', motto: 'Open source, open minds.', image: 'https://picsum.photos/seed/omar/400/400' },
        ],
    },
    {
        title: 'Library Board Trustee',
        description: 'Upcoming election for a seat on the public library board. Candidates not yet announced.',
        thumbnail: 'https://picsum.photos/seed/election-library/600/400',
        candidates: [],
    },
    {
        title: 'Parks Committee Representative',
        description: 'Upcoming election for the city parks committee. Candidate registration is still open.',
        thumbnail: 'https://picsum.photos/seed/election-parks/600/400',
        candidates: [],
    },
];

const seedDatabase = async () => {
    try {
        await connectDB();

        await Promise.all([
            VoterModel.deleteMany({}),
            ElectionModel.deleteMany({}),
            CandidateModel.deleteMany({}),
        ]);
        console.log('Cleared voters, elections, and candidates collections');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(SEED_PASSWORD, salt);
        const voters = await VoterModel.insertMany(
            voterData.map(voter => ({ ...voter, password: hashedPassword })),
        );
        console.log(`Created ${voters.length} voters`);

        const nonAdminVoters = voters.filter(voter => !voter.isAdmin);

        for (const { candidates: candidateList, ...electionFields } of electionData) {
            const election = await ElectionModel.create(electionFields);
            const candidates = await CandidateModel.insertMany(
                candidateList.map(candidate => ({ ...candidate, electionId: election._id })),
            );

            // Each non-admin voter casts one vote for a random candidate, so
            // voteCounts, election.voters, and voter.votedElections stay consistent.
            // Elections without candidates get no votes.
            for (const voter of candidates.length ? nonAdminVoters : []) {
                const candidate = candidates[Math.floor(Math.random() * candidates.length)];
                candidate.voteCount += 1;
                election.voters.push(voter._id);
                voter.votedElections.push(election._id);
            }

            await Promise.all(candidates.map(candidate => candidate.save()));
            await election.save();
            console.log(`Created election "${election.title}" with ${candidates.length} candidates`);
        }

        await Promise.all(nonAdminVoters.map(voter => voter.save()));

        console.log('\nDatabase seeded successfully!');
        console.log(`Log in with any seeded email (e.g. admin@example.com) and password: ${SEED_PASSWORD}`);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

seedDatabase();
