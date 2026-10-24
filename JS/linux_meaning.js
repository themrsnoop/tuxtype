function find_node(data, name) {
  return data.commands[name] ?? data.builtins[name];
}

function form_part(label, text) {
  return text ? { label, text } : null;
}

export function give_meaning(data, commandText) {
  const [name, ...words] = commandText.split(" ");
  let node = find_node(data, name);
  const parts = [form_part(name, node.desc)];

  const subcommand = node.subcommands?.[words[0]] ? words.shift() : null;
  if (subcommand) {
    node = node.subcommands[subcommand];
    parts.push(form_part(`${name} ${subcommand}`, node.desc));
  }

  for (const word of words) {
    if (word.startsWith("-")) parts.push(form_part(word, node.flag_desc?.[word]));
  }

  return parts.filter(Boolean);
}
