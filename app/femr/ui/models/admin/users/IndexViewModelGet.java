package femr.ui.models.admin.users;

import femr.data.models.IUser;

import java.util.List;

public class IndexViewModelGet {
    private List<? extends IUser> users;

    public IUser getUser(int i){
        return users.get(i);
    }

    public void setUsers(List<? extends IUser> users) {
        this.users = users;
    }

    public List<? extends IUser> getUsers() {
        return users;
    }
}
