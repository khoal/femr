package femr.ui.models.research;

public class PatientGraphItem {

    private int Id;
    private String key;
    private Integer value;

    public PatientGraphItem(String key, Integer value){

        this.key = key;
        this.value = value;
    }

    public int getId() {
        return Id;
    }

    public void setId(int id) {
        Id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }
}
