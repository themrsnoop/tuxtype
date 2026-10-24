//import { randMand } from "./linux_gacha.js";
//const data = await (await fetch("linux_commands.json")).json();
//randMand(data);
const IGNORED_FLAGS = ["-h", "--help", "-V", "--version"];
const NON_POSITIONAL_ARG_PATTERN = /OPTION|COMMAND/i;
const MAX_POSITIONAL_ARGS = 2;

const FALLBACK_VALUES = ["file.txt", "example"];

const VALUES_BY_PLACEHOLDER = [
{ matches: /FILE|PATH|SRC/i,           values: ["homework.txt", "app.log", "/etc/pam.d/common-auth", "plans.txt", "latest.log", "fix.patch"] },
{ matches: /DIR|DEST/i,                values: ["/etc/shadow", "~/homework", "./src", "./"] },
{ matches: /PATTERN|STRING|TEXT/i,     values: ["error", "TODO:", "main", "swap"] },
{ matches: /URL/i,                     values: ["http://flesh.com", "https://crazyshit.com", "https://google.com", "https://hipaa.gov"] },
{ matches: /HOST|ADDR/i,               values: ["localhost", "192.168.1.10"] },
{ matches: /USER|OWNER/i,              values: ["root", "somsnosar", "snoop"] },
{ matches: /NUM|SIZE|COUNT|LINES/i,    values: ["1", "5", "10", "314", "69"] },
];

function rand_item(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function rand_int_range(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function sum_of(numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

function match_values(placeholder) {
  const rule = VALUES_BY_PLACEHOLDER.find(({ matches }) => matches.test(placeholder));
  return rand_item(rule ? rule.values : FALLBACK_VALUES);
}

function take_key(weightsByKey) {
  const keys = Object.keys(weightsByKey);
  const totalWeight = sum_of(Object.values(weightsByKey));
  let remaining = Math.random() * totalWeight;

  for (const key of keys) {
    remaining -= weightsByKey[key];
    if (remaining <= 0) return key;
  }

  return keys[keys.length - 1];
}

function pull_weights(itemsByName) {
  return Object.fromEntries(
    Object.entries(itemsByName).map(([name, item]) => [name, item.weight])
  );
}

function cull_ignores(flags) {
  const usableFlags = { ...flags };
  for (const flag of IGNORED_FLAGS) delete usableFlags[flag];
  return usableFlags;
}

function take_command(data) {
  return take_key({
    ...pull_weights(data.builtins),
                         ...pull_weights(data.commands),
  });
}

function form_flag(flag, node) {
  const argPlaceholder = node.flag_args?.[flag];
  return argPlaceholder ? `${flag} ${match_values(argPlaceholder)}` : flag;
}

function take_flag(node, maxFlags) {
  const availableFlags = cull_ignores(node.flags);
  const flagCount = rand_int_range(1, maxFlags);
  const chosenFlags = [];

  while (chosenFlags.length < flagCount && Object.keys(availableFlags).length > 0) {
    const flag = take_key(availableFlags);
    delete availableFlags[flag];
    chosenFlags.push(form_flag(flag, node));
  }

  return chosenFlags;
}

function take_arguments(node) {
  return (node.args ?? [])
  .slice(0, MAX_POSITIONAL_ARGS)
  .filter((arg) => !NON_POSITIONAL_ARG_PATTERN.test(arg))
  .map(match_values);
}

export function randMand(data, maxFlags = 2) {
  const commandName = take_command(data);
  let node = data.commands[commandName] ?? data.builtins[commandName];
  const words = [commandName];

  if (node.subcommands) {
    const subcommandName = take_key(pull_weights(node.subcommands));
    words.push(subcommandName);
    node = node.subcommands[subcommandName];
  }

  words.push(...take_flag(node, maxFlags));
  words.push(...take_arguments(node));

  return words.join(" ");
}
