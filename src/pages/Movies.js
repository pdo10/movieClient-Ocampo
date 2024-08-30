import React, { useContext } from 'react';
import MovieUserView from '../components/MovieUserView';
import MovieAdminView from '../components/MovieAdminView';
import UserContext from '../UserContext';

const Movies = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      {user.isAdmin ? <MovieAdminView /> : <MovieUserView />}
    </>
  );
};

export default Movies;
