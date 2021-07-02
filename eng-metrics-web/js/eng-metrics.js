function sel_stack(valueKey) {
    return function(d) {
        return d.value[valueKey];
    };
};

function expandStoryStatusPayload(epicData) {
    var storyArray = [];
    epicData.map( epic => {
        // For each status type in the epic, push X objects onto the 
        // array, where X is the number of stories with the given status
        for (let x=0;x<epic.issuesToDo;x++) {
            storyObject = { "Name" : epic.name, "Type" : "To Do"}
            storyArray.push(storyObject);
        }
        for (let x=0;x<epic.issuesInProgress;x++) {
            storyObject = {"Name" : epic.name, "Type" : "In Progress"}
            storyArray.push(storyObject);
        }
        for (let x=0;x<epic.issuesDone;x++) {
            storyObject = {"Name" : epic.name, "Type" : "Done"}
            storyArray.push(storyObject);
        }
        for (let x=0;x<epic.issuesUnestimated;x++) {
            storyObject = {"Name" : epic.name, "Type" : "Unestimated"}
            storyArray.push(storyObject);
        }
    })
    return storyArray;
}
