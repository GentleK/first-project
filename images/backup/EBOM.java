package com.migration.main;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

import matrix.db.Context;
import matrix.db.MQLCommand;
import matrix.util.MatrixException;
import matrix.util.StringList;

/**
 * 
 * @author Matrix Data Migration Program
 *
 */
public class EBOM {
	public static long startTime = 0;
	public static long endTime = 0;
	public static String filePath = "D:/";
	public static void main(String[] args) {
		startTime = System.currentTimeMillis();
		System.out.println("************************************");
		System.out.println("         Migration 시작 합니다.        ");
		System.out.println("************************************");
		
		Context context;
		try {
			context = getContext();
			System.out.println("+++++++++Context 접속 완료+++++++++");
			
			//1
			//모든 리스트 추출 경로는 메소드 안에 있음.
			//getBusList(context, "imkPDMProductIFRT",filePath);
			//System.out.println("++++++++"+filePath+" 파일 생성 완료++++++++++");
			//모든 리스트를 뽑은 후에는 위에 주석 처리
			
			//2
			//추출한 파일을 수동으로 파일 분리.
			String fileName = "imkPDMProductIFRT_List.mql"; //위에 정의한 filePath
			StringList loadData = loadBus(context,filePath,fileName);
			
			//모든 리스트 추출 후 릴레이션 뽑는 쿼리
			m1RelBusMql(context,"Part","EBOM",loadData);
			
			System.out.println("############################################################");
			System.out.println("###                     Migration 완료.                    ###");
			endTime = System.currentTimeMillis();
			context.disconnect();
			System.out.println("### time : " + ( endTime - startTime )/1000.0 +"         ###");
			System.out.println("############################################################");
		} catch (MatrixException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		
	}
	
	public static Context getContext() throws MatrixException{
		//Context context = new Context("http://192.168.49.234:8080/enovia"); //개발
		Context context = new Context("http://192.168.32.200/enovia"); //운영
		context.setUser("creator");
		context.setVault("eService Production");
		context.connect();
		
		return context;
	}
	
	public static void getBusList(Context context, String fromType,String filePath) throws IOException{
		MQLCommand cmd = new MQLCommand();

		int count = 0;

		String file_name = fromType+"_List";

		try {
			cmd.open(context);
			String typeList = "temp query bus '"+fromType+"' * * where revision==last select id dump ♬";
			cmd.executeCommand(context, typeList);
			String tempResult = cmd.getResult();
			cmd.close(context);
			createRelMql(tempResult, filePath, file_name);
			System.out.println("             "+fromType+"   전체 쿼리 완료                   ");
		} catch (MatrixException e) {
			e.printStackTrace();
		}
	}
	
	public static void m1RelBusMql(Context context, String Type ,String relName ,StringList objectList){
		MQLCommand cmd = new MQLCommand();

		int count = 0;

		String file_name = Type+"_"+relName+"_데이터추출_"+startTime;

		try {
			StringList createMqlList = new StringList();
			

			System.out.println("************"+Type+" "+relName+" 데이터 추출 시작합니다.**************************");
			for (int rowIndex = 0 ;  rowIndex < objectList.size(); rowIndex++) {
				fileWriteLog("REL_"+Type, count);
				count = rowIndex;
				StringBuffer mqlQuery = new StringBuffer();        
				System.out.println(objectList.get(rowIndex));
				String objId = ((String)(objectList.get(rowIndex))).split("♬")[3];
				//connect  정보
				mqlQuery.append("print bus "+objId+" select from["+relName+"].id dump ♬");
				cmd.open(context);
				cmd.executeCommand(context, mqlQuery.toString());
				cmd.close(context);
				String relResult = cmd.getResult();
				if(!relResult.equals("") && !relResult.equals("\n")){
					String[] relResultRow = relResult.split("♬");
					for (int i = 0; i < relResultRow.length; i++) {
						String relId = relResultRow[i];
						String fromType = "";
						String fromName = "";
						String fromRevision = "";
						String toType = "";
						String toName = "";
						String toRevision = "";
						String FindNumber = "";
						String Quantity = "";
						String Usage = "";
						String ReferenceDesignator = "";
						String StartEffectivityDate = "";
						String Notes = "";
						String ComponentLocation = "";
						String EndEffectivityDate = "";
						String HasManufacturingSubstitute = "";
						String Source = "";
						String imkPDMEBOMBoard = "";
						String imkPDMEBOMOperation = "";
						String imkPDMEBOMRoutePart = "";
						String Title = "";
						String changeType = "";
						StringBuffer connQuery = new StringBuffer();        
						//connect  정보
						connQuery.append("print connection "+relId+" select");
						connQuery.append(" type"); //rel Name
						connQuery.append(" from.type");
						connQuery.append(" from.name");
						connQuery.append(" from.revision");
						//김사장님 문의
						connQuery.append(" to.attribute[imkChangePhantomType]");
						//김사장님 문의
						connQuery.append(" to.type");
						connQuery.append(" to.name");
						connQuery.append(" to.revision");
						connQuery.append(" attribute[Find Number]");	
						connQuery.append(" attribute[Quantity]");	
						connQuery.append(" attribute[Usage]");	
						connQuery.append(" attribute[Reference Designator]");	
						connQuery.append(" attribute[Start Effectivity Date]");	
						connQuery.append(" attribute[Notes]");	
						connQuery.append(" attribute[Component Location]");	
						connQuery.append(" attribute[End Effectivity Date]");	
						connQuery.append(" attribute[Has Manufacturing Substitute]");	
						connQuery.append(" attribute[Source]");	
						connQuery.append(" attribute[imkPDMEBOMBoard]");	
						connQuery.append(" attribute[imkPDMEBOMOperation]");	
						connQuery.append(" attribute[imkPDMEBOMRoutePart]");	
						connQuery.append(" attribute[Title]");	
						cmd.open(context);
						cmd.executeCommand(context, connQuery.toString());
						System.out.println(connQuery.toString());
						String connResult = cmd.getResult();

						String[] connResultRow = connResult.split("\n");

						for (int pRowIndex1 = 1; pRowIndex1 < connResultRow.length; pRowIndex1++) {
							//기본속성 mapping
							if(connResultRow[pRowIndex1].split("=").length == 2){
								String printKey = connResultRow[pRowIndex1].split("=")[0].trim();
								String printValue = connResultRow[pRowIndex1].split("=")[1].trim();
								System.out.println("printKey : "+printKey+" ****** printValue : "+printValue);
								
								if(printKey.equals("from.type")){
									fromType = printValue;
								}else if(printKey.equals("from.name")){
									fromName = printValue;
								}else if(printKey.equals("from.revision")){
									fromRevision = printValue;
								}else if(printKey.equals("to.type")){
									toType = printValue;
								}else if(printKey.equals("to.name")){
									toName = printValue;
								}else if(printKey.equals("to.revision")){
									toRevision = printValue;
								}else if(printKey.equals("attribute[Find Number]")){
									FindNumber = printValue;
								}else if(printKey.equals("attribute[Quantity]")){
									Quantity = printValue;
								}else if(printKey.equals("attribute[Usage]")){
									Usage = printValue;
								}else if(printKey.equals("attribute[Reference Designator]")){
									ReferenceDesignator = printValue;
								}else if(printKey.equals("attribute[Start Effectivity Date]")){
									StartEffectivityDate = printValue;
								}else if(printKey.equals("attribute[Notes]")){
									Notes = printValue;
								}else if(printKey.equals("attribute[Component Location]")){
									ComponentLocation = printValue;
								}else if(printKey.equals("attribute[End Effectivity Date]")){
									EndEffectivityDate = printValue;
								}else if(printKey.equals("attribute[Has Manufacturing Substitute]")){
									HasManufacturingSubstitute = printValue;
								}else if(printKey.equals("attribute[Source]")){
									Source = printValue;
								}else if(printKey.equals("attribute[imkPDMEBOMBoard]")){
									imkPDMEBOMBoard = printValue;
								}else if(printKey.equals("attribute[imkPDMEBOMOperation]")){
									imkPDMEBOMOperation = printValue;
								}else if(printKey.equals("attribute[imkPDMEBOMRoutePart]")){
									imkPDMEBOMRoutePart = printValue;
								}else if(printKey.equals("attribute[Title]")){
									Title = printValue;
								}else if(printKey.equals("to.attribute[imkChangePhantomType]")){
									    //김사장님 문의
										//상위의 제품의 하위 와이어링 아세이를 찾아서 재구성
										changeType = printValue;
								}
								
							}
						}

						if("imkPartPLM00220".equals(toType)) {
							//연결된 상위 와이어링 아세이를 찾아서 from을 교체 한다.
							cmd.open(context);
							cmd.executeCommand(context, "print bus "+objId+" select from[EBOM].to[imkPartPLM00250].name from[EBOM].to[imkPartPLM00250].revision dump ♬");
							String rst = cmd.getResult();
							fromType = "imkPartPLM00250";
							fromName = rst.split("♬")[0];
							fromRevision = rst.split("♬")[1].replace("\n", "");
						}
						
						if(!"".equals(changeType)) {
							toType = changeType;
						}
						
						StringBuffer createMql = new StringBuffer();
						//1 fromType
						createMql.append(fromType);
						createMql.append("♬");
						//2 fromName
						createMql.append(fromName);
						createMql.append("♬");
						//3 fromRevision
						createMql.append(fromRevision);
						createMql.append("♬");
						//4 toType
						createMql.append(toType);
						createMql.append("♬");
						//5 toName
						createMql.append(toName);
						createMql.append("♬");
						//6 toRevision
						createMql.append(toRevision);
						createMql.append("♬");
						//7 FindNumber
						createMql.append(FindNumber);
						createMql.append("♬");
						//8 Quantity
						createMql.append(Quantity);
						createMql.append("♬");
						//9 Usage
						createMql.append(Usage);
						createMql.append("♬");
						//10 ReferenceDesignator
						createMql.append(ReferenceDesignator);
						createMql.append("♬");
						//11 StartEffectivityDate
						createMql.append(StartEffectivityDate);
						createMql.append("♬");
						//12 Notes
						createMql.append(Notes);
						createMql.append("♬");
						//13 ComponentLocation
						createMql.append(ComponentLocation);
						createMql.append("♬");
						//14 EndEffectivityDate
						createMql.append(EndEffectivityDate);
						createMql.append("♬");
						//15 HasManufacturingSubstitute
						createMql.append(HasManufacturingSubstitute);
						createMql.append("♬");
						//16 Source
						createMql.append(Source);
						createMql.append("♬");
						//17 imkPDMEBOMBoard
						createMql.append(imkPDMEBOMBoard);
						createMql.append("♬");
						//18 imkPDMEBOMOperation
						createMql.append(imkPDMEBOMOperation);
						createMql.append("♬");
						//19 imkPDMEBOMRoutePart
						createMql.append(imkPDMEBOMRoutePart);
						createMql.append("♬");
						//20 Title
						createMql.append(Title);
						createMql.append("♬");
						
						/*
						createMql.append("connect bus '"+fromType+"' ");

						if(fromName.contains("'")){
							createMql.append("\""+fromName+"\" ");
						}else{
							createMql.append("'"+fromName+"' ");
						}

						createMql.append("'"+fromRevision+"' ");
						createMql.append("rel '"+relName+"' ");
						createMql.append("to '"+toType+"' ");

						if(toName.contains("'")){
							createMql.append("\""+toName+"\" ");
						}else{
							createMql.append("'"+toName+"' ");
						}
						createMql.append("'"+toRevision+"' ");

						for (int pRowIndex2 = 1; pRowIndex2 < connResultRow.length; pRowIndex2++) {
							//attribute mapping
							if(connResultRow[pRowIndex2].split("=").length==2){
								String key = connResultRow[pRowIndex2].split("=")[0].trim();
								if(key.contains("attribute")){
									key = key.replace("attribute[", "");
									key = key.replace("]", "");
									String value = connResultRow[pRowIndex2].split("=")[1].trim();
									if(!value.equals("")){
										if(value.contains("'")){
											createMql.append("\""+key+"\" \""+value+"\" ");
										}else{
											createMql.append("'"+key+"' '"+value+"' ");
										}
									}
								}
							}
						}

						createMql.append(";");
						*/
						createMqlList.add(createMql);
						cmd.close(context);
					}
				}
			}
			try {
				System.out.println("       conn Mql 정리 완료.       ");
				createRelMql(createMqlList, file_name);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		
		} catch (MatrixException e) {
			e.printStackTrace();
		}
	}
	
	public static void createRelMql(String str, String filePath, String file_name) throws IOException{
		file_name = file_name.replaceAll(" ", "_");
		BufferedWriter bfw = new BufferedWriter(new FileWriter(filePath+file_name+".mql"));
		bfw.write(str);
		bfw.close();
		System.out.println("************** 모든 ObjectList >>> "+file_name+"MQL 생성 완료 ****************");
	}
	
	public static void createRelMql(StringList createMqlList, String file_name) throws IOException{
		file_name = file_name.replaceAll(" ", "_");
		System.out.println("==========================>> 파일에 쓰는중...");
		BufferedWriter bfw = new BufferedWriter(new FileWriter(filePath+file_name+".mql"));

		for (int i = createMqlList.size()-1; i >= 0 ; i--) {
			bfw.write(createMqlList.get(i).toString()+"\n");
		}

		bfw.close();
		System.out.println("**************"+file_name+"릴레이션 추출 완료 ****************");
	}
	
	public static StringList loadBus(Context context,String filePath,String fileName) throws Exception{
		File file = new File(filePath+fileName); 
		StringList objectIdList = new StringList();
		if(file.exists()) { 
			BufferedReader inFile = new BufferedReader(new FileReader(file)); 
			String sLine = null; 
			
			while((sLine = inFile.readLine()) != null) {
				objectIdList.add(sLine);
			}
		}
		return objectIdList;
    }
	
	public static void fileWriteLog(String sType,int count){
		Date date = new Date();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		String name = filePath+sType+format.format(date)+".log";
		try {
			FileWriter out = new FileWriter(name, true);
			PrintWriter log = new PrintWriter(out,true);
			log.println(getNowTime()+"      ▶▷▶▷▶▷                                "+sType+"                   :▶▷▶▷▶▷ "+count);
			out.flush();
			out.close();
			log.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static String getNowTime(){
		Date date = new Date();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String strDate = "["+format.format(date)+"]";
		return strDate;
	}
}
