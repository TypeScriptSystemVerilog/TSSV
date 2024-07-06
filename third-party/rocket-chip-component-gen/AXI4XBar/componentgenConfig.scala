package tssv.componentgen

import chisel3._
import org.chipsalliance.cde.config._
import freechips.rocketchip.diplomacy._
import freechips.rocketchip.subsystem._
import freechips.rocketchip.tile._
import freechips.rocketchip.amba.axi4._
import org.json4s._
import org.json4s.jackson.JsonMethods._
import scala.io.Source


// Case class representing the structure of your JSON
case class AxiXBarParamsJSON(
    moduleName: String,
    masters: Seq[AxiMasterParamsJSON],
    beatBytes: Int,
    addrBits: Int,
    idBits: Int,
    slaves: Seq[AxiSlaveParamsJSON]
)
case class AxiMasterParamsJSON(name: String, id: Seq[Int])
case class AxiSlaveParamsJSON(
    name: String,
    address: SlaveAddressJSON,
    transferSizesWrite: Seq[Int],
    transferSizesRead: Seq[Int]
)
case class SlaveAddressJSON(base: String, mask: String)

case object MyAXISubsystemParamsKey extends Field[MyAXISubsystemParams]

class WithMastersSlavesAXI
    extends Config((site, here, up) => {
      case `MyAXISubsystemParamsKey` => {

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
        val paramsJSON = json.extract[AxiXBarParamsJSON]

        MyAXISubsystemParams(
          moduleName = paramsJSON.moduleName, 
          masters = paramsJSON.masters.map((m) => { AXI4MasterParameters(name = m.name, id = IdRange(m.id(0), m.id(1))) }),
          beatBytes = paramsJSON.beatBytes,
          addrBits = paramsJSON.addrBits,
          idBits = paramsJSON.idBits,
          slaves = paramsJSON.slaves.map((s) => {
            AXI4SlaveParameters(
              address = Seq(AddressSet(
                java.lang.Long.parseLong(s.address.base.stripPrefix("0x"),16),
                java.lang.Long.parseLong(s.address.mask.stripPrefix("0x"),16))),
              supportsWrite = TransferSizes(s.transferSizesWrite(0), s.transferSizesWrite(1)),
              supportsRead = TransferSizes(s.transferSizesRead(0), s.transferSizesRead(1))
            )
          }),
          slaveNames = 
            paramsJSON.slaves.map((s) => { s.name })
        )
      }
    })

class MyAXIConfig
    extends Config(
      new WithMastersSlavesAXI
    )
