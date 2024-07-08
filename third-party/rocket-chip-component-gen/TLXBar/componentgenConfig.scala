package tssv.componentgen

import chisel3._
import org.chipsalliance.cde.config._
import freechips.rocketchip.diplomacy._
import freechips.rocketchip.subsystem._
import freechips.rocketchip.tile._
import freechips.rocketchip.tilelink._
import org.json4s._
import org.json4s.jackson.JsonMethods._
import scala.io.Source


// Case class representing the structure of your JSON
case class TLXBarComponentGenParamsJSON(
    moduleName: String,
    masters: Seq[TLMasterParamsJSON],
    beatBytes: Int,
    addrBits: Int,
    sourceBits: Int,
    sinkBits: Int,
    sizeBits: Int,
    slaves: Seq[TLSlaveParamsJSON]
)
case class TLMasterParamsJSON(name: String, sourceId: Seq[Int])
case class TLSlaveParamsJSON(
    name: String,
    address: TLSlaveAddressJSON,
    transferSizesGet: Seq[Int],
    transferSizesPutFull: Seq[Int],
    transferSizesPutPartial: Seq[Int]
)
case class TLSlaveAddressJSON(base: String, mask: String)

case object TLXBarComponentGenParamsKey extends Field[TLXBarComponentGenParams]

class WithMastersSlavesTL
    extends Config((site, here, up) => {
      case `TLXBarComponentGenParamsKey` => {

        // Define the implicit formats for json4s
        implicit val formats: DefaultFormats.type = DefaultFormats

        // Read the JSON file
        val jsonSource =
          Source.fromFile("src/main/scala/componentgen/componentgenConfig.json")
        val jsonString =
          try jsonSource.mkString
          finally jsonSource.close()

        // Parse the JSON string
        val json = parse(jsonString)

        // Extract the JSON into the case class
        val paramsJSON = json.extract[TLXBarComponentGenParamsJSON]

        TLXBarComponentGenParams(
          moduleName = paramsJSON.moduleName, 
          masters = paramsJSON.masters.map((m) => { TLMasterParameters.v1(name = m.name, sourceId = IdRange(m.sourceId(0), m.sourceId(1))) }),
          beatBytes = paramsJSON.beatBytes,
          addrBits = paramsJSON.addrBits,
          sourceBits = paramsJSON.sourceBits,
          sinkBits = paramsJSON.sinkBits,
          sizeBits = paramsJSON.sizeBits,
          slaves = paramsJSON.slaves.map((s) => {
            TLSlaveParameters.v1(
              address = Seq(AddressSet(
                java.lang.Long.parseLong(s.address.base.stripPrefix("0x"),16),
                java.lang.Long.parseLong(s.address.mask.stripPrefix("0x"),16))),
              supportsGet = TransferSizes(s.transferSizesGet(0), s.transferSizesGet(1)),
              supportsPutFull = TransferSizes(s.transferSizesPutFull(0), s.transferSizesPutFull(1)),
              supportsPutPartial = TransferSizes(s.transferSizesPutPartial(0), s.transferSizesPutPartial(1))
            )
          }),
          slaveNames = 
            paramsJSON.slaves.map((s) => { s.name })
        )
      }
    })
  

class TLXBarComponentGenConfig
    extends Config(
      new WithMastersSlavesTL
    )
