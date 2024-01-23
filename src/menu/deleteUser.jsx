import { auth } from '../firebase/config'; 

  export const handleDeleteUser = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account forever? This action is irreversible.'
    );

    if (confirmDelete) {
      const user = auth.currentUser;

      if (user) {
        // Delete the user account
        user
          .delete()
          .then(() => {
            console.log('User account deleted successfully.');
          })
          .catch((error) => {
            console.error('Error deleting user:', error.message);
          });
      }
    }
  };