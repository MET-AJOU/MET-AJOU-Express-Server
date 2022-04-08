export const getJoinedUsersState = (UsersState, UserIdToRoom, roomId) =>
    Array.from(UsersState.entries()).map(([userId, userState]) => {
        if (roomId === UserIdToRoom.get(userId)) return userState;
    });

export const getUserState = (UsersState, _userId) => {
    return [...UsersState.values()].filter((userState) => {
        const { userId } = userState;
        if (userId === _userId) return userState;
    })[0];
};