import { defaultKeyBoardState as keyState } from '../constant.js';

export const makeJoinNewUserBody = ({ userId, characterId, position }) => {
  return {
    userId,
    characterId: characterId ?? 1,
    position: {
      ...position,
      y: position.y + userId,
    },
    keyState,
  };
};
