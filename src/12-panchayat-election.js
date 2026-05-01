/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  // Private state — not accessible from outside
  let votes = {};
  const registeredVoters = new Map(); // voterId => voter object
  const castedVotes = new Set(); // voterIds who already voted

  // Initialize vote count for each candidate
  for (const candidate of candidates) {
    votes[candidate.id] = 0;
  }

  function findCandidate(candidateId) {
    return candidates.find(function (c) {
      return c.id === candidateId;
    });
  }

  return {
    registerVoter(voter) {
      if (!voter || !voter.id || !voter.name || !voter.age) return false;
      if (voter.age < 18) return false;
      if (registeredVoters.has(voter.id)) return false;
      registeredVoters.set(voter.id, voter);
      return true;
    },

    castVote(voterId, candidateId, onSuccess, onError) {
      if (!registeredVoters.has(voterId)) {
        return onError("Voter not registered");
      }
      if (!findCandidate(candidateId)) {
        return onError("Candidate not found");
      }
      if (castedVotes.has(voterId)) {
        return onError("Voter has already voted");
      }

      votes = tallyPure(votes, candidateId); // pure function — no mutation
      castedVotes.add(voterId);
      return onSuccess({ voterId, candidateId });
    },

    getResults(sortFn) {
      const results = candidates.map(function (candidate) {
        return {
          id: candidate.id,
          name: candidate.name,
          party: candidate.party,
          votes: votes[candidate.id],
        };
      });

      if (sortFn) return results.sort(sortFn);

      // Default: sort by votes descending
      return results.sort(function (a, b) {
        return b.votes - a.votes;
      });
    },

    getWinner() {
      const totalVotes = Object.values(votes).reduce(function (sum, v) {
        return sum + v;
      }, 0);
      if (totalVotes === 0) return null;

      const results = this.getResults(); // already sorted by votes desc
      return results[0];
    },
  };
}

export function createVoteValidator(rules) {
  return function (voter) {
    if (!voter) {
      return { valid: false, reason: "Voter is null or undefined" };
    }

    // Check all required fields exist
    for (const field of rules.requiredFields) {
      if (!voter[field]) {
        return { valid: false, reason: `Missing required field: ${field}` };
      }
    }

    // Check minimum age
    if (voter.age < rules.minAge) {
      return {
        valid: false,
        reason: `Voter must be at least ${rules.minAge} years old`,
      };
    }

    return { valid: true, reason: "" };
  };
}

export function countVotesInRegions(regionTree) {
  if (!regionTree || typeof regionTree !== "object") return 0;
  if (typeof regionTree.votes !== "number") return 0;

  // Base case: no subRegions
  if (!regionTree.subRegions || regionTree.subRegions.length === 0) {
    return regionTree.votes;
  }

  // Recursive case: this region's votes + all subRegion votes
  let subTotal = 0;
  for (const subRegion of regionTree.subRegions) {
    subTotal += countVotesInRegions(subRegion);
  }
  return regionTree.votes + subTotal;
}

export function tallyPure(currentTally, candidateId) {
  return {
    ...currentTally,
    [candidateId]: (currentTally[candidateId] ?? 0) + 1,
  };
}
