import { getModule } from '../utils/modules';
import { create } from '../utils/patcher';

function patchSettings() {
  const Patcher = create('SettingsPatch');

  let UserSettingsOverview;
  const Settings = getModule(m => m.default?.name == 'UserSettingsOverviewWrapper');
  const unpatch = Patcher.after(Settings, 'default', (_, args, res) => {
    if (UserSettingsOverview !== undefined) {
      return;
    }

    unpatch();

    UserSettingsOverview = res.type;

    Patcher.after(UserSettingsOverview.prototype, "render", (_, args, res) => {
      const children = res.props.children;
      const Messages = getModule(x => x.default?.Messages).default.Messages;
      const React = getModule(m => m.createElement, true);
      const nitroIndex = children.findIndex(x => x.props.title === Messages["PREMIUM_SETTINGS"]);
      const nitro = children[nitroIndex];

      // console.log(children);

      const { FormSection, FormRow } = getModule(m => m.FormSection);

      const aliucordSection = <FormSection title="Aliucord">
        <FormRow label="o/" arrowShown={true} onPress={() => alert("hello!")} ></FormRow>
      </FormSection>;

      children.splice(nitroIndex, 0, aliucordSection);
    });
  });
}

export {
  patchSettings
}