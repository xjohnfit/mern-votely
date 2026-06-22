import { createSlice } from '@reduxjs/toolkit'

const currentVoter = {
    id: 1,
    token: 'asdasdasd',
    isAdmin: true,
}

const initialState = {
    currentVoter: currentVoter,
    selectedVoteCandidate: '',
    selectedElection: '',
    idOfElectionToUpdate: '',
    addCandidateElectionId: ''
}


const voteSlice = createSlice({
    name: 'vote',
    initialState: initialState,
    reducers: {
        changeSelectedVoteCandidate(state, action) {
            state.selectedVoteCandidate = action.payload;
        },

        changeSelectedElection(state, action) {
            state.selectedElection = action.payload;
        },

        changeIdOfElectionToUpdate(state, action) {
            state.idOfElectionToUpdate = action.payload;
        },

        changeAddCandidateElectionId(state, action) {
            state.addCandidateElectionId = action.payload
        }
    }
});

export const voteActions = voteSlice.actions;

export default voteSlice;
