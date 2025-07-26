import React, { useEffect, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const VirtualKeyboard = ({ setKeyboardInput, hintIndex, toggleCheckAnswer, giveUp, showGiveUp}) => {
  const [layoutName, setLayoutName] = useState("minimal");

  const playIcon = <i className="fi fi-sr-play-pause"></i>

  useEffect(() => {
    // console.log(!toggleCheckAnswer && hintIndex <= 0)

    if(showGiveUp && !giveUp && !toggleCheckAnswer) {
      setLayoutName("giveup")
      return
    } else if(showGiveUp && !giveUp && toggleCheckAnswer) {
      setLayoutName("giveuporcheck")
      return
    }

    if(giveUp) {
      setLayoutName("nextonly")
      return
    }

    if (!toggleCheckAnswer && hintIndex > 0) {
      setLayoutName("withoutCheck");
    } else if (!toggleCheckAnswer && hintIndex <= 0) {
      setLayoutName("minimal");
    } else if (toggleCheckAnswer && hintIndex > 0) {
      setLayoutName("withHint");
    } else if (toggleCheckAnswer && hintIndex <= 0) {
      setLayoutName("withGetHint");
    } else if (!toggleCheckAnswer && hintIndex <= 0) {
      setLayoutName("withGetHint");
    }
  }, [hintIndex, toggleCheckAnswer, showGiveUp, giveUp]);

  const customKeys = {
    hint : { "{hint}": `💡 Hint ${hintIndex}`},
    gethints : {"{gethint}": "Add hints"},
    check : {"{check}": `✅ Check`,},
    bksp : {"{bksp}": "⌫"},
    play : {"{play}": `<i class="fi fi-sr-play-pause"></i>`}
  }

  const layouts = {
    withoutCheck: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "{play} z x c v b n m {bksp}",
      "{hint}"
    ],
    withHint: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "{play} z x c v b n m {bksp}",
      "{hint} {check}"
    ],
    withGetHint: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "{play} z x c v b n m {bksp}",
      "{gethint} {check}"
    ],
    minimal: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "{play} z x c v b n m {bksp}",
      "{gethint}"
    ],
    nextonly: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "z x c v b n m {bksp}",
      "{next}"
    ],
    giveup: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "z x c v b n m {bksp}",
      "{hint} {giveup}"
    ],
    giveuporcheck: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "z x c v b n m {bksp}",
      "{hint} {giveup} {check}"
    ]
  };

  const displays = {
    withoutCheck: {
      "{hint}": `💡 Hint ${hintIndex}`,
      "{bksp}": "⌫",
      "{play}": `<i class="fi fi-sr-play-pause"></i>`
    },
    withHint: {
      "{hint}": `💡 Hint ${hintIndex}`,
      "{check}": `✅ Check`,
      "{bksp}": "⌫",
      "{play}": `<i class="fi fi-sr-play-pause"></i>`
    },
    withGetHint: {
      "{gethint}": "Add hints",
      "{check}": `✅ Check`,
      "{bksp}": "⌫",
      "{play}": `<i class="fi fi-sr-play-pause"></i>`
    },
    minimal: {
      "{bksp}": "⌫",
      "{gethint}": "Add hints",
      "{play}": `<i class="fi fi-sr-play-pause"></i>`
    },
    nextonly: {
      "{bksp}": "⌫",
      "{next}": "Next Pic",
    },
    giveup: {
      "{hint}": `💡 Hint ${hintIndex}`,
      "{bksp}": "⌫",
      "{giveup}": "Give Up",
    },
    giveuporcheck: {
      "{hint}": `💡Hint ${hintIndex}`,
      "{bksp}": "⌫",
      "{giveup}": "Give Up",
      "{check}": `✅Check`,
    }
  };

  return (
    <div>
      <Keyboard
        layout={{ default: layouts[layoutName] }}
        display={displays[layoutName]}
        onKeyPress={button => setKeyboardInput(button)}
        buttonTheme={[
          {
            class: "highlight-hint",
            buttons: "{hint} {gethint}"
          },
          {
            class: "highlight-check",
            buttons: "{check}"
          },
          {
            class: "highlight-wrong",
            buttons: "{giveup}"
          },
          {
            class: "highlight-next",
            buttons: "{next}"
          },
          {
            class: "highlight-play",
            buttons: "{play}"
          },
          {
            class: "highlight-bksp",
            buttons: "{bksp}"
          }
        ]}
      />
    </div>
  );
};

export default VirtualKeyboard;
