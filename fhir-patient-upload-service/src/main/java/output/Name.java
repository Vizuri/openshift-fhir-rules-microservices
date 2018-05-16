
package output;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Generated("org.jsonschema2pojo")
@JsonPropertyOrder({
    "text",
    "family",
    "given"
})
public class Name {

    @JsonProperty("text")
    private String text;
    @JsonProperty("family")
    private String family;
    @JsonProperty("given")
    private List<String> given = new ArrayList<String>();

    /**
     * 
     * @return
     *     The text
     */
    @JsonProperty("text")
    public String getText() {
        return text;
    }

    /**
     * 
     * @param text
     *     The text
     */
    @JsonProperty("text")
    public void setText(String text) {
        this.text = text;
    }

    /**
     * 
     * @return
     *     The family
     */
    @JsonProperty("family")
    public String getFamily() {
        return family;
    }

    /**
     * 
     * @param family
     *     The family
     */
    @JsonProperty("family")
    public void setFamily(String family) {
        this.family = family;
    }

    /**
     * 
     * @return
     *     The given
     */
    @JsonProperty("given")
    public List<String> getGiven() {
        return given;
    }

    /**
     * 
     * @param given
     *     The given
     */
    @JsonProperty("given")
    public void setGiven(List<String> given) {
        this.given = given;
    }

}
