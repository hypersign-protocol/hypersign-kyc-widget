/* eslint-disable no-unused-vars */
const binFileUtils = require('@iden3/binfileutils')
const ffjavascript = require('ffjavascript')
const circom_runtime = require('circom_runtime')
const fastfile = require('fastfile')

const Scalar = ffjavascript.Scalar

const bls12381r$1 = ffjavascript.Scalar.e('73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001', 16)
const bn128r$1 = ffjavascript.Scalar.e('21888242871839275222246405745257275088548364400416034343698204186575808495617')

const bls12381q = ffjavascript.Scalar.e('1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab', 16)
const bn128q = ffjavascript.Scalar.e('21888242871839275222246405745257275088696311157297823662689037894645226208583')
function log2(V) {
  const t = ((V & 0xffff0000) !== 0 ? ((V &= 0xffff0000), 16) : 0) | ((V & 0xff00ff00) !== 0 ? ((V &= 0xff00ff00), 8) : 0) | ((V & 0xf0f0f0f0) !== 0 ? ((V &= 0xf0f0f0f0), 4) : 0) | ((V & 0xcccccccc) !== 0 ? ((V &= 0xcccccccc), 2) : 0) | ((V & 0xaaaaaaaa) !== 0)
  return t
}

async function writeG1(fd, curve, p) {
  const buff = new Uint8Array(curve.G1.F.n8 * 2)
  curve.G1.toRprLEM(buff, 0, p)
  await fd.write(buff)
}

async function writeG2(fd, curve, p) {
  const buff = new Uint8Array(curve.G2.F.n8 * 2)
  curve.G2.toRprLEM(buff, 0, p)
  await fd.write(buff)
}

async function readG1(fd, curve, toObject) {
  const buff = await fd.read(curve.G1.F.n8 * 2)
  const res = curve.G1.fromRprLEM(buff, 0)
  return toObject ? curve.G1.toObject(res) : res
}

async function readG2(fd, curve, toObject) {
  const buff = await fd.read(curve.G2.F.n8 * 2)
  const res = curve.G2.fromRprLEM(buff, 0)
  return toObject ? curve.G2.toObject(res) : res
}

const HEADER_ZKEY_SECTION = 1

const GROTH16_PROTOCOL_ID = 1
const PLONK_PROTOCOL_ID = 2
const FFLONK_PROTOCOL_ID = 10
async function readHeader(fd, sections, toObject) {
  // Read Header
  /// //////////////////
  await binFileUtils.startReadUniqueSection(fd, sections, 1)
  const protocolId = await fd.readULE32()
  await binFileUtils.endReadSection(fd)

  if (protocolId === GROTH16_PROTOCOL_ID) {
    return await readHeaderGroth16(fd, sections, toObject)
  } else {
    throw new Error('Protocol not supported: ')
  }
}

async function getCurveFromR(r) {
  let curve
  if (ffjavascript.Scalar.eq(r, bn128r$1)) {
    curve = await ffjavascript.buildBn128()
  } else if (ffjavascript.Scalar.eq(r, bls12381r$1)) {
    curve = await ffjavascript.buildBls12381()
  } else {
    throw new Error(`Curve not supported: ${ffjavascript.Scalar.toString(r)}`)
  }
  return curve
}

async function getCurveFromQ(q) {
  let curve
  if (ffjavascript.Scalar.eq(q, bn128q)) {
    curve = await ffjavascript.buildBn128()
  } else if (ffjavascript.Scalar.eq(q, bls12381q)) {
    curve = await ffjavascript.buildBls12381()
  } else {
    throw new Error(`Curve not supported: ${ffjavascript.Scalar.toString(q)}`)
  }
  return curve
}

async function getCurveFromName(name) {
  let curve
  const normName = normalizeName(name)
  if (['BN128', 'BN254', 'ALTBN128'].indexOf(normName) >= 0) {
    curve = await ffjavascript.buildBn128()
  } else if (['BLS12381'].indexOf(normName) >= 0) {
    curve = await ffjavascript.buildBls12381()
  } else {
    throw new Error(`Curve not supported: ${name}`)
  }
  return curve

  function normalizeName(n) {
    return n
      .toUpperCase()
      .match(/[A-Za-z0-9]+/g)
      .join('')
  }
}

async function readHeaderGroth16(fd, sections, toObject) {
  const zkey = {}

  zkey.protocol = 'groth16'

  // Read Groth Header
  /// //////////////////
  await binFileUtils.startReadUniqueSection(fd, sections, 2)
  const n8q = await fd.readULE32()
  zkey.n8q = n8q
  zkey.q = await binFileUtils.readBigInt(fd, n8q)

  const n8r = await fd.readULE32()
  zkey.n8r = n8r
  zkey.r = await binFileUtils.readBigInt(fd, n8r)
  zkey.curve = await getCurveFromQ(zkey.q)
  zkey.nVars = await fd.readULE32()
  zkey.nPublic = await fd.readULE32()
  zkey.domainSize = await fd.readULE32()
  zkey.power = log2(zkey.domainSize)
  zkey.vk_alpha_1 = await readG1(fd, zkey.curve, toObject)
  zkey.vk_beta_1 = await readG1(fd, zkey.curve, toObject)
  zkey.vk_beta_2 = await readG2(fd, zkey.curve, toObject)
  zkey.vk_gamma_2 = await readG2(fd, zkey.curve, toObject)
  zkey.vk_delta_1 = await readG1(fd, zkey.curve, toObject)
  zkey.vk_delta_2 = await readG2(fd, zkey.curve, toObject)
  await binFileUtils.endReadSection(fd)

  return zkey
}

const getGroth16VK = async (zkey, fd, sections) => {
  const curve = await getCurveFromQ(zkey.q)
  const sG1 = curve.G1.F.n8 * 2

  // Read IC Section
  /// ////////
  await binFileUtils.startReadUniqueSection(fd, sections, 3)
  const ic = []
  for (let i = 0; i <= zkey.nPublic; i++) {
    const buff = await fd.read(sG1)
    const P = Array.from(curve.G1.toUncompressed(buff))
    ic.push(P)
  }
  await binFileUtils.endReadSection(fd)

  const alpha1_uncompressed = curve.G1.toUncompressed(zkey.vk_alpha_1)
  const beta2_uncompressed = curve.G2.toUncompressed(zkey.vk_beta_2)
  const gamma2_uncompressed = curve.G2.toUncompressed(zkey.vk_gamma_2)
  const delta2_uncompressed = curve.G2.toUncompressed(zkey.vk_delta_2)

  const vkey = {}
  vkey.alpha_1 = Array.from(alpha1_uncompressed)
  vkey.beta_2 = Array.from(beta2_uncompressed)
  vkey.gamma_2 = Array.from(gamma2_uncompressed)
  vkey.delta_2 = Array.from(delta2_uncompressed)
  vkey.ic = ic
  return vkey
}

export async function writeBin(fd, witnessBin, prime) {
  await binFileUtils.startWriteSection(fd, 1)
  const n8 = (Math.floor((Scalar.bitLength(prime) - 1) / 64) + 1) * 8
  await fd.writeULE32(n8)
  await binFileUtils.writeBigInt(fd, prime, n8)
  if (witnessBin.byteLength % n8 !== 0) {
    throw new Error('Invalid witness length')
  }
  await fd.writeULE32(witnessBin.byteLength / n8)
  await binFileUtils.endWriteSection(fd)

  await binFileUtils.startWriteSection(fd, 2)
  await fd.write(witnessBin)
  await binFileUtils.endWriteSection(fd)
}

async function wtnsCalculate(_input, wasmFileName, wtnsFileName, options) {
  const input = ffjavascript.utils.unstringifyBigInts(_input)

  const fdWasm = await fastfile.readExisting(wasmFileName)
  const wasm = await fdWasm.read(fdWasm.totalSize)
  await fdWasm.close()

  const wc = await circom_runtime.WitnessCalculatorBuilder(wasm)
  if (wc.circom_version() === 1) {
    const w = await wc.calculateBinWitness(input)

    const fdWtns = await binFileUtils.createBinFile(wtnsFileName, 'wtns', 2, 2)
    await writeBin(fdWtns, w, wc.prime)
    await fdWtns.close()
  } else {
    const fdWtns = await fastfile.createOverride(wtnsFileName)

    const w = await wc.calculateWTNSBin(input)

    await fdWtns.write(w)
    await fdWtns.close()
  }
}
// Modify Groth16 proof to be uncompressed
async function groth16FullProve(_input, wasmFile, zkeyFileName, logger) {
  const input = ffjavascript.utils.unstringifyBigInts(_input)

  const wtns = {
    type: 'mem',
  }
  await wtnsCalculate(input, wasmFile, wtns)
  return await groth16Prove(zkeyFileName, wtns, logger)
}
async function readHeader_insideProve(fd, sections) {
  await binFileUtils.startReadUniqueSection(fd, sections, 1)
  const n8 = await fd.readULE32()
  const q = await binFileUtils.readBigInt(fd, n8)
  const nWitness = await fd.readULE32()
  await binFileUtils.endReadSection(fd)

  return { n8, q, nWitness }
}

async function groth16Prove(zkeyFileName, witnessFileName, logger) {
  const { fd: fdWtns, sections: sectionsWtns } = await binFileUtils.readBinFile(witnessFileName, 'wtns', 2, 1 << 25, 1 << 23)

  const wtns = await readHeader_insideProve(fdWtns, sectionsWtns)

  const { fd: fdZKey, sections: sectionsZKey } = await binFileUtils.readBinFile(zkeyFileName, 'zkey', 2, 1 << 25, 1 << 23)

  const zkey = await readHeader(fdZKey, sectionsZKey)

  if (zkey.protocol !== 'groth16') {
    throw new Error('zkey file is not groth16')
  }

  if (!ffjavascript.Scalar.eq(zkey.r, wtns.q)) {
    throw new Error('Curve of the witness does not match the curve of the proving key')
  }

  if (wtns.nWitness !== zkey.nVars) {
    throw new Error(`Invalid witness length. Circuit: ${zkey.nVars}, witness: ${wtns.nWitness}`)
  }

  const curve = zkey.curve
  const Fr = curve.Fr
  const G1 = curve.G1
  const G2 = curve.G2

  const power = log2(zkey.domainSize)

  if (logger) logger.debug('Reading Wtns')
  const buffWitness = await binFileUtils.readSection(fdWtns, sectionsWtns, 2)
  if (logger) logger.debug('Reading Coeffs')
  const buffCoeffs = await binFileUtils.readSection(fdZKey, sectionsZKey, 4)

  if (logger) logger.debug('Building ABC')
  const [buffA_T, buffB_T, buffC_T] = await buildABC1(curve, zkey, buffWitness, buffCoeffs, logger)

  const inc = power === Fr.s ? curve.Fr.shift : curve.Fr.w[power + 1]

  const buffA = await Fr.ifft(buffA_T, '', '', logger, 'IFFT_A')
  const buffAodd = await Fr.batchApplyKey(buffA, Fr.e(1), inc)
  const buffAodd_T = await Fr.fft(buffAodd, '', '', logger, 'FFT_A')

  const buffB = await Fr.ifft(buffB_T, '', '', logger, 'IFFT_B')
  const buffBodd = await Fr.batchApplyKey(buffB, Fr.e(1), inc)
  const buffBodd_T = await Fr.fft(buffBodd, '', '', logger, 'FFT_B')

  const buffC = await Fr.ifft(buffC_T, '', '', logger, 'IFFT_C')
  const buffCodd = await Fr.batchApplyKey(buffC, Fr.e(1), inc)
  const buffCodd_T = await Fr.fft(buffCodd, '', '', logger, 'FFT_C')

  if (logger) logger.debug('Join ABC')
  const buffPodd_T = await joinABC(curve, zkey, buffAodd_T, buffBodd_T, buffCodd_T, logger)

  let proof = {}

  if (logger) logger.debug('Reading A Points')
  const buffBasesA = await binFileUtils.readSection(fdZKey, sectionsZKey, 5)
  proof.pi_a = await curve.G1.multiExpAffine(buffBasesA, buffWitness, logger, 'multiexp A')

  if (logger) logger.debug('Reading B1 Points')
  const buffBasesB1 = await binFileUtils.readSection(fdZKey, sectionsZKey, 6)
  let pib1 = await curve.G1.multiExpAffine(buffBasesB1, buffWitness, logger, 'multiexp B1')

  if (logger) logger.debug('Reading B2 Points')
  const buffBasesB2 = await binFileUtils.readSection(fdZKey, sectionsZKey, 7)
  proof.pi_b = await curve.G2.multiExpAffine(buffBasesB2, buffWitness, logger, 'multiexp B2')

  if (logger) logger.debug('Reading C Points')
  const buffBasesC = await binFileUtils.readSection(fdZKey, sectionsZKey, 8)
  proof.pi_c = await curve.G1.multiExpAffine(buffBasesC, buffWitness.slice((zkey.nPublic + 1) * curve.Fr.n8), logger, 'multiexp C')

  if (logger) logger.debug('Reading H Points')
  const buffBasesH = await binFileUtils.readSection(fdZKey, sectionsZKey, 9)
  const resH = await curve.G1.multiExpAffine(buffBasesH, buffPodd_T, logger, 'multiexp H')

  const r = curve.Fr.random()
  const s = curve.Fr.random()

  proof.pi_a = G1.add(proof.pi_a, zkey.vk_alpha_1)
  proof.pi_a = G1.add(proof.pi_a, G1.timesFr(zkey.vk_delta_1, r))

  proof.pi_b = G2.add(proof.pi_b, zkey.vk_beta_2)
  proof.pi_b = G2.add(proof.pi_b, G2.timesFr(zkey.vk_delta_2, s))

  pib1 = G1.add(pib1, zkey.vk_beta_1)
  pib1 = G1.add(pib1, G1.timesFr(zkey.vk_delta_1, s))

  proof.pi_c = G1.add(proof.pi_c, resH)

  proof.pi_c = G1.add(proof.pi_c, G1.timesFr(proof.pi_a, s))
  proof.pi_c = G1.add(proof.pi_c, G1.timesFr(pib1, r))
  proof.pi_c = G1.add(proof.pi_c, G1.timesFr(zkey.vk_delta_1, Fr.neg(Fr.mul(r, s))))

  let publicSignals = []

  for (let i = 1; i <= zkey.nPublic; i++) {
    const b = buffWitness.slice(i * Fr.n8, i * Fr.n8 + Fr.n8)
    publicSignals.push(ffjavascript.Scalar.fromRprLE(b))
  }

  const uncompressed_proof = {}
  const uncompressed_pia = Array.from(curve.G1.toUncompressed(G1.toAffine(proof.pi_a)))
  const uncompressed_pib = Array.from(curve.G2.toUncompressed(G2.toAffine(proof.pi_b)))
  const uncompressed_pic = Array.from(curve.G1.toUncompressed(G1.toAffine(proof.pi_c)))

  uncompressed_proof.pi_a = uncompressed_pia
  uncompressed_proof.pi_b = uncompressed_pib
  uncompressed_proof.pi_c = uncompressed_pic

  proof.pi_a = G1.toObject(G1.toAffine(proof.pi_a))
  proof.pi_b = G2.toObject(G2.toAffine(proof.pi_b))
  proof.pi_c = G1.toObject(G1.toAffine(proof.pi_c))

  proof.protocol = 'groth16'
  proof.curve = curve.name
  uncompressed_proof.protocol = proof.protocol
  uncompressed_proof.curve = proof.curve

  await fdZKey.close()
  await fdWtns.close()

  proof = ffjavascript.utils.stringifyBigInts(proof)
  publicSignals = ffjavascript.utils.stringifyBigInts(publicSignals)

  return { proof, publicSignals, uncompressed_proof }
}

function _toCompressed(arr, Gn) {
  if (arr.byteLength !== Gn.F.n8 * 2) {
    throw new Error('Invalid uncompressed point size')
  }
  return Gn.toObject(Gn.fromRprUncompressed(arr, 0))
}

async function toCompressProof({ pi_a, pi_b, pi_c, protocol, curve }, verifyKey) {
  if (curve !== 'bn128') {
    throw new Error('Curve not supported')
  }
  if (protocol !== 'groth16') {
    throw new Error('Protocol not supported')
  }

  const compressed_pi_a = _toCompressed(Buffer.from(pi_a), verifyKey.curve.G1)
  const compressed_pi_b = _toCompressed(Buffer.from(pi_b), verifyKey.curve.G2)
  const compressed_pi_c = _toCompressed(Buffer.from(pi_c), verifyKey.curve.G1)
  const proof = {}
  proof.pi_a = compressed_pi_a
  proof.pi_b = compressed_pi_b
  proof.pi_c = compressed_pi_c
  proof.protocol = protocol
  proof.curve = curve

  return ffjavascript.utils.stringifyBigInts(proof)
}

async function buildABC1(curve, zkey, witness, coeffs, logger) {
  const n8 = curve.Fr.n8
  const sCoef = 4 * 3 + zkey.n8r
  const nCoef = (coeffs.byteLength - 4) / sCoef

  const outBuffA = new ffjavascript.BigBuffer(zkey.domainSize * n8)
  const outBuffB = new ffjavascript.BigBuffer(zkey.domainSize * n8)
  const outBuffC = new ffjavascript.BigBuffer(zkey.domainSize * n8)

  const outBuf = [outBuffA, outBuffB]
  for (let i = 0; i < nCoef; i++) {
    if (logger && i % 1000000 === 0) logger.debug(`QAP AB: ${i}/${nCoef}`)
    const buffCoef = coeffs.slice(4 + i * sCoef, 4 + i * sCoef + sCoef)
    const buffCoefV = new DataView(buffCoef.buffer)
    const m = buffCoefV.getUint32(0, true)
    const c = buffCoefV.getUint32(4, true)
    const s = buffCoefV.getUint32(8, true)
    const coef = buffCoef.slice(12, 12 + n8)
    outBuf[m].set(curve.Fr.add(outBuf[m].slice(c * n8, c * n8 + n8), curve.Fr.mul(coef, witness.slice(s * n8, s * n8 + n8))), c * n8)
  }

  for (let i = 0; i < zkey.domainSize; i++) {
    if (logger && i % 1000000 === 0) {
      logger.debug(`QAP C: ${i}/${zkey.domainSize}`)
    }
    outBuffC.set(curve.Fr.mul(outBuffA.slice(i * n8, i * n8 + n8), outBuffB.slice(i * n8, i * n8 + n8)), i * n8)
  }

  return [outBuffA, outBuffB, outBuffC]
}

async function joinABC(curve, zkey, a, b, c, logger) {
  const MAX_CHUNK_SIZE = 1 << 22

  const n8 = curve.Fr.n8
  const nElements = Math.floor(a.byteLength / curve.Fr.n8)

  const promises = []

  for (let i = 0; i < nElements; i += MAX_CHUNK_SIZE) {
    if (logger) logger.debug(`JoinABC: ${i}/${nElements}`)
    const n = Math.min(nElements - i, MAX_CHUNK_SIZE)

    const task = []

    const aChunk = a.slice(i * n8, (i + n) * n8)
    const bChunk = b.slice(i * n8, (i + n) * n8)
    const cChunk = c.slice(i * n8, (i + n) * n8)

    task.push({ cmd: 'ALLOCSET', var: 0, buff: aChunk })
    task.push({ cmd: 'ALLOCSET', var: 1, buff: bChunk })
    task.push({ cmd: 'ALLOCSET', var: 2, buff: cChunk })
    task.push({ cmd: 'ALLOC', var: 3, len: n * n8 })
    task.push({
      cmd: 'CALL',
      fnName: 'qap_joinABC',
      params: [{ var: 0 }, { var: 1 }, { var: 2 }, { val: n }, { var: 3 }],
    })
    task.push({
      cmd: 'CALL',
      fnName: 'frm_batchFromMontgomery',
      params: [{ var: 3 }, { val: n }, { var: 3 }],
    })
    task.push({ cmd: 'GET', out: 0, var: 3, len: n * n8 })
    promises.push(curve.tm.queueAction(task))
  }

  const result = await Promise.all(promises)

  let outBuff
  if (a instanceof ffjavascript.BigBuffer) {
    outBuff = new ffjavascript.BigBuffer(a.byteLength)
  } else {
    outBuff = new Uint8Array(a.byteLength)
  }

  let p = 0
  for (let i = 0; i < result.length; i++) {
    outBuff.set(result[i][0], p)
    p += result[i][0].byteLength
  }

  return outBuff
}

export { readHeader, getCurveFromQ, getGroth16VK, groth16FullProve, toCompressProof }
