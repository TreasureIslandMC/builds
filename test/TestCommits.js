const testJobs = require('../test/TestJobs.js');

module.exports = (assert, github) => {
    return function() {
        this.timeout(8000);

        testJobs(false, (job) => github.getLatestCommit(job));

        it("should resolve for 'TreasureIslandMC/builds:gh-pages'", () => {
            var job = {
                author: "TreasureIslandMC",
                repo: "builds",
                branch: "gh-pages",
				directory: "TreasureIslandMC/builds/gh-pages"
            }

            return github.getLatestCommit(job).then((commit) => Promise.all([
                assert.exists(commit),
                assert.isObject(commit),

                assert.notExists(commit.documentation_url),

                assert.exists(commit.sha),
                assert.exists(commit.author),
                assert.exists(commit.commit.message)
            ]));
        });

        it("should reject for 'TreasureIslandMC/builds:nope' (Invalid branch)", () => {
            var job = {
                author: "TreasureIslandMC",
                repo: "builds",
                branch: "nope"
            }

            return assert.isRejected(github.getLatestCommit(job));
        });

        it("should reject for 'TreasureIslandMC/____:master' (Not-existing Repository)", () => {
            var job = {
                author: "TreasureIslandMC",
                repo: "____",
                branch: "master"
            }

            return assert.isRejected(github.getLatestCommit(job));
        });
    }
}
