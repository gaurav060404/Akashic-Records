import { posterState, ratedPosterState, upcomingPosterState } from '../store/store';

export default function returnState(title,category) {
  if (title === "series") {
    if (category === "upcoming") {
      return upcomingPosterState;
    } else if (category === "rated") {
      return ratedPosterState;
    } else {
      return posterState;
    }
  } else if (title === "anime") {
    if (category === "upcoming") {
      return upcomingPosterState;
    } else if (category === "rated") {
      return ratedPosterState;
    } else {
      return posterState;
    }
  } else if (title === "movies") {
    if (category === "upcoming") {
      return upcomingPosterState;
    } else if (category === "rated") {
      return ratedPosterState;
    } else {
      return posterState;
    }
  } else {
    return posterState;
  }
}
