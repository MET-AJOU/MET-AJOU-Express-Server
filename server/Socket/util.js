export const getJoinedUsersState = (UsersState, UserIdToRoom, roomId) =>
    Array.from(UsersState.entries()).reduce((acc, [userId, userState]) => {
        return roomId === UserIdToRoom.get(userId) ? [...acc, userState] : acc;
    }, []);

export const getUserState = (UsersState, _userId) => {
    return [...UsersState.values()].filter((userState) => {
        const {
            userId
        } = userState;
        if (userId === _userId) return userState;
    })[0];
};