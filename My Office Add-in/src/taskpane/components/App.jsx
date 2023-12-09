import * as React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import HeroList from "./HeroList";
import TextInsertion from "./TextInsertion";
import DialigWindow from "./DialigWindow";
import { makeStyles } from "@fluentui/react-components";
import { Ribbon24Regular, LockOpen24Regular, DesignIdeas24Regular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const urlQueryParameters = new URLSearchParams(window.location.search);

const App = (props) => {
  const styles = useStyles();
  // The list items are static and won't change at runtime,
  // so this should be an ordinary const, not a part of state.
  const listItems = [
    {
      icon: <Ribbon24Regular />,
      primaryText: "Achieve more with Office integration",
    },
    {
      icon: <LockOpen24Regular />,
      primaryText: "Unlock features and functionality",
    },
    {
      icon: <DesignIdeas24Regular />,
      primaryText: "Create and visualize like a pro",
    },
  ];

  return (
    
    <div className={styles.root}>
      {/* I'm a dialog window */ urlQueryParameters.get("dialogID") != null && <React.Fragment>
        <DialigWindow dialogID={urlQueryParameters.get("dialogID")} formula = {urlQueryParameters.get("formula")}/>
            </React.Fragment>}
      {/* I'm NOT a dialog window (I'm the main taskpane ui) */ urlQueryParameters.get("dialogID") == null &&<React.Fragment>
        <Header logo="assets/logo-filled.png" title={props.title} message="Welcome" />
        <HeroList message="Discover what this add-in can do for you today!" items={listItems} />
        <TextInsertion />
      </React.Fragment>}
    </div>
  );
};

App.propTypes = {
  title: PropTypes.string,
};

export default App;
