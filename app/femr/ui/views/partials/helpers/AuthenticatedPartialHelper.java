package femr.ui.views.partials.helpers;

import femr.data.models.IRole;
import femr.data.models.Roles;

import java.util.List;

public class AuthenticatedPartialHelper {

    public static boolean showAdminMenu(List<IRole> roles) {
        for (IRole role : roles) {
            if (role.getId() == Roles.ADMINISTRATOR) {
                return true;
            }
        }

        return false;
    }

    public static boolean showMedicalPersonnelMenu(List<IRole> roles) {
        for (IRole role : roles) {
            if (role.getId() == Roles.PHARMACIST || role.getId() == Roles.PHYSICIAN || role.getId() == Roles.NURSE) {
                return true;
            }
        }

        return false;
    }

    public static boolean showResearcherMenu(List<IRole> roles) {
        for (IRole role : roles) {
            if (role.getId() == Roles.RESEARCHER) {
                return true;
            }
        }

        return false;
    }

    public static boolean showSuperUserMenu(List<IRole> roles) {
        for (IRole role : roles) {
            if (role.getId() == Roles.SUPERUSER) {
                return true;
            }
        }

        return false;
    }

}
