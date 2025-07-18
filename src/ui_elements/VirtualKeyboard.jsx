import React, { useEffect, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const VirtualKeyboard = ({ setKeyboardInput, hintIndex, toggleCheckAnswer }) => {
  const [layoutName, setLayoutName] = useState("minimal");

  useEffect(() => {
    // console.log(!toggleCheckAnswer && hintIndex <= 0)
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
  }, [hintIndex, toggleCheckAnswer]);

  const layouts = {
    withoutCheck: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "z x c v b n m {bksp}",
      "{hint}"
    ],
    withHint: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "z x c v b n m {bksp}",
      "{hint} {check}"
    ],
    withGetHint: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "z x c v b n m {bksp}",
      "{gethint} {check}"
    ],
    minimal: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "z x c v b n m {bksp}",
      "{gethint}"
    ]
  };

  const displays = {
    withoutCheck: {
      "{hint}": `💡 Hint ${hintIndex}`,
      "{bksp}": "⌫"
    },
    withHint: {
      "{hint}": `💡 Hint ${hintIndex}`,
      "{check}": `✅ Check`,
      "{bksp}": "⌫"
    },
    withGetHint: {
      "{gethint}": "Add hints",
      "{check}": `✅ Check`,
      "{bksp}": "⌫"
    },
    minimal: {
      "{bksp}": "⌫",
      "{gethint}": "Add hints",
    }
  };

  return (
    <div>
      <Keyboard
        layout={{ default: layouts[layoutName] }}
        display={displays[layoutName]}
        onKeyPress={(button) => setKeyboardInput(button)}
      />
    </div>
  );
};

export default VirtualKeyboard;
