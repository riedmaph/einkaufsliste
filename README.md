# Shopping List
A simple shopping list app with addtional convenience features to improve the shopping experience.

## Features
- [ ] Basic shopping list
- [ ] Multi-list support
- [ ] Multi-user editing
- [ ] Data Mining of Super market information
- [ ] List optimization


## Tech-Stack
// - [Docker](https://www.docker.com/)
### Frontend
- [node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org)
- [Angular2](https://angular.io)

### Backend
// - [Elasticsearch](...)


## Setup
### Frontend
- Install dependencies: `npm install`
- Run dev server: `npm start`
- Run unit tests: `npm test` (Coverage reports are found in `/coverage`)
- Run end to end tests: `npm run e2e`
### Backend


## Definition of Done
- All requirements are met.

- Changes to the requirements are documented.
- All public interfaces and API endpoints are documented.
- Private and protected code need not be documented. Use common sense.
- Story-documentation is current.

- Code is linting error free.
- The code contains no FIXMEs or similar tags. TODOs only if optional.
- The code contains no temporary development hacks.

- Program logic is unit tested.
- API endpoints are unit tested.
- New UI components are end-to-end tested.
- All tests are successful.

- Changes are peer reviewed.
- Conformance to the requirements was checked by a peer.
- Code is merged into the master branch.


## Backlog

### [#1] I want to show a list of entries
- A list page show a list of entries.
- A list entry contains simple text.
- Entries that are too long are cut (overflowing text is hidden).
- Entries are loaded from the backend.

### [#2] I want to add entries to the list
__Depends on [#1]__
- The list page has an input field and a submit button.
- This form submits new entries.
- The form can be submitted by clicking the submit button or hitting the enter key.
- New entries must be simple strings.
- New entries may have a maximum length of 140 characters.
- New entries are appended to the list.
- Entries are persisted.

### [#3] I want to remove entries from the list
__Depends on [#1]__
- Each entry has a button to remove that entry.
- Removal requires two actions (initiation and confirmation).
- Removed items can not be recovered.
- The gap in the list is filled by the following entries.
- Removal is persisted.

### [#4] I want to mark entries as completed
__Depends on [#1]__
- Each entry has a button to mark that entry as completed.
- Each list has a separate 'completed' section that holds all completed entries.
- Entries marked as completed are moved to that section.
- Entries in the completed section can be removed and marked as not completed.
- Removing works the same as in [#3].
- Marking as not-completed moves entries back to the normal list.
- Entries returned to the original list need not be at their original position.
- Completion state is persisted.

### [#5] I want to edit entries in the list
__Depends on [#1]__
__Depends on [#3]__
- Each entry has a button to toggle editabiliy.
- When editable, the text of an entry can be changed.
- The remove and complete button are hidden during editing.
- Completed entries cannot be edited. The can however be marked as not-completed and then be edited.
- Editing can be comitted and aborted. There is a button for each.
- Hitting enter also commits the changes.
- If changes are invalid (too long), the edit cannot be commited. A hint is shown.
- Changing an entry to be empty removes it.
- Changes are persisted.

### [#6] I want to reorder the list
__Depends on [#1]__
- Each entry has a drag indicator.
- Grabbing it (click or touch) allows to move that entry.
- The visual order is updated as the entry is moved.
- The updated order is persisted.

### [#7] I want to receive auto completion hints
__Depends on [#2]__
- When typing into the text field from [#2] auto-completion suggestions are shown.
- For the time being, auto-completion is done from a dictionary. This will be extended in the future.
- Auto-completion occurs when at least three characters are entered.
- Auto-completion is updated as the user types.
- If auto-completion takes time, a loading indicator is shown.
- When no auto-completion suggestions are available, a hint tells the user.
- Hitting tab enters the suggesiton into the text-field.
- Hitting enter commits that suggestion, appending it to the list.
- Hitting escape closes auto-completion.

### [#8] I want to have multiple lists
__Depends on [#1]__
- I can create multiple lists.
- Each list has a name.
- I have an overview of my lists where I can navigate to their individual pages.
- The overview shows the name of all lists, the number of entries per list and the number of completed entries.
- On the overview page I can create a new empty list.
- To create a list I have to name it.
- The name of a list can be changed on the overview page and on the lists page.
- I can remove lists on the overview page and on the lists page.
- Items from removed lists are removed.

### [#9] I want to lookup local prices for entries on my list
__Depends on [#1]__
__Depends on [#17]__

### [#10] I want to group entries on my list
__Depends on [#8]__

### [#11] I want to optimize a list by price
__Depends on [#9]__

### [#12] I want to move entries between lists
__Depends on [#8]__

### [#13] I want to create an account
- I need to enter my email-address and a password.
- I have to confirm the password to make sure I typed it correctly.
- Upon account creation I can immediately start creating lists and entries.
- After creation the account is in a state of "unconfirmed-email".
- I receive an email to confirm my email address.

### [#14] I want to login / logout


### [#15] I want to share lists with other users (read-only)
__Depends on [#8]__
__Depends on [#13]__

### [#16] I want to have lists with shared ownership
__Depends on [#8]__
__Depends on [#13]__

### [#17] I want to gather information for various super markets
__Subtasks:__
- [ ] [#18]
- [ ] [#19]
### [#18] I want to crawl supermarket webpages

### [#19] I want to gather relevant information in the crawled data
__Depends on [#18]__

### [#20] I want to receive notifications when items on my list are on sale
__Depends on [#1]__
__Depends on [#19]__

### [#21] I want to distinguish between generic product descriptions and specific brand descriptions
__Depends on [#7]__
__Depends on [#19]__

### [#22] I want to reset my password
__Depends on [#13]__

### [#23] I want to be able to receive email notifications
- This is only concered with the general setup, not the content of the mails.
