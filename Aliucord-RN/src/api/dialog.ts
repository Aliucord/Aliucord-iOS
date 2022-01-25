import { getModule } from "../utils/modules";

const dialogModule = getModule((m) => m.default?.show);

function show(options) {
  dialogModule.default.show(options);
}

export {
  show
}