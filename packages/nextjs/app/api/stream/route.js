function main(stream) {
  const data = stream.data ? stream.data : stream;

  if (!Array.isArray(data)) {
    console.error("Stream data is not an array.");
    return null;
  }

  const topicHashes = new Set([
    "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67", // Swap
    // "0x7a53080ba414158be7ec69b987b5fb7d07dee101fe85488f0853ae16239d0bde", // Mint
    // "0x0c396cd989a39f4459b5fa1aed6a9a8dcdbc45908acfd67e028cd568da98982c", // Burn
  ]);

  const logs = data.flatMap(innerArray => {
    if (Array.isArray(innerArray)) {
      const receipt = innerArray[0];
      if (receipt && Array.isArray(receipt.logs)) {
        return receipt.logs;
      }
    }
    return [];
  });

  const filteredLogs = logs.filter(log => log.topics && log.topics.length > 0 && topicHashes.has(log.topics[0]));

  if (filteredLogs.length === 0) {
    console.log("No relevant logs found.");
    return;
  }

  return filteredLogs;
}
