import UserRepository from "../infrastructure/UserRepository";

export default class UpdateProfileService {
  constructor(private userRepository: UserRepository) {}

  async updateProfile(userId: number, firstName: string, lastName: string, email: string) {
    // Vérifier que l'utilisateur existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        throw new Error("EMAIL_ALREADY_USED");
      }
    }

    // Mettre à jour le profil
    await this.userRepository.updateProfile(userId, firstName, lastName, email);

    // Récupérer les informations mises à jour
    const updatedUser = await this.userRepository.findByIdWithDetails(userId);

    return {
      message: "Profile successfully updated",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        role: updatedUser.role,
        isNewUser: updatedUser.is_new_user === true
      }
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findByIdWithDetails(userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isNewUser: user.is_new_user === true
    };
  }

  async setUserNewStatus(userId: number, isNewUser: boolean) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    await this.userRepository.updateIsNewUser(userId, isNewUser);

    return {
      message: "User new status updated",
      userId,
      isNewUser
    };
  }

  async setUserNewStatusByEmail(email: string, isNewUser: boolean) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    await this.userRepository.updateIsNewUserByEmail(email, isNewUser);

    return {
      message: "User new status updated",
      email,
      isNewUser
    };
  }
}